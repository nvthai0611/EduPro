import { Request, Response } from "express";
import { SubmissionService } from "./submission.service";
import axios from "axios";
import { decryptData, encryptData } from "../../../utils/encryption";

const JUDGE0_URL = "https://ce.judge0.com";

const problems = {
    "01": {
        id: "01",
        title: "Chào mừng đến với JavaScript",
        testcases: [
            { stdin: "", expected_output: "Hello World\n" },
            { stdin: "", expected_output: "Hello World" }
        ]
    },
    "02": {
        id: "02",
        title: "Cộng hai số",
        testcases: [
            { stdin: "[10, 20, 30]", expected_output: "60\n" },
            { stdin: "[5, 5, 5]", expected_output: "15\n" },
            { stdin: "[-1, 1, 0]", expected_output: "0\n" }
        ]
    },
    "03": {
        id: "03",
        title: "Chia hai số",
        testcases: [
            { stdin: "[10, 2]", expected_output: "5\n" },
            { stdin: "[10, 4]", expected_output: "2.50\n" },
            { stdin: "[-6, 3]", expected_output: "-2\n" },
            { stdin: "[1, 3]", expected_output: "0.33\n" },
            { stdin: "[10, 0]", expected_output: "Not Valid\n" },
            { stdin: "[0, 0]", expected_output: "Not Valid\n" }
        ]
    },
    "04": {
        id: "04",
        title: "Đảo ngược từ trong câu",
        description: "Viết hàm solve(str) nhận vào một chuỗi. Hãy đảo ngược thứ tự các từ trong chuỗi đó (các từ cách nhau bởi dấu cách).",
        testcases: [
            { stdin: "[\"Hello World\"]", expected_output: "World Hello\n" },
            { stdin: "[\"JavaScript is fun\"]", expected_output: "fun is JavaScript\n" },
            { stdin: "[\"Code\"]", expected_output: "Code\n" },
            { stdin: "[\"  Hanoi  HCMC  \"]", expected_output: "HCMC Hanoi\n" } // Testcase xử lý khoảng trắng thừa
        ]
    },
    "05": {
        id: "05",
        title: "Số lớn thứ hai",
        description: "Viết hàm solve(arr) để tìm số lớn thứ hai trong mảng. Nếu không tìm thấy (mảng có ít hơn 2 số khác nhau), trả về 'Not Found'.",
        testcases: [
            { stdin: "[[1, 2, 3, 4, 5]]", expected_output: "4\n" },
            { stdin: "[[10, 10, 10]]", expected_output: "Not Found\n" },
            { stdin: "[[5, 2, 8, 8, 7]]", expected_output: "7\n" },
            { stdin: "[[-10, -5, -20]]", expected_output: "-10\n" },
            { stdin: "[[1, 100]]", expected_output: "1\n" },
            { stdin: "[[]]", expected_output: "Not Found\n" },
            { stdin: "[[7]]", expected_output: "Not Found\n" },
            { stdin: "[[1, 2, 2, 2]]", expected_output: "1\n" },
            { stdin: "[[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]", expected_output: "9\n" },
            { stdin: "[[0, 0, 1]]", expected_output: "0\n" },
            { stdin: "[[100, 200, 150, 150]]", expected_output: "150\n" },
            { stdin: "[[1, 3, 5, 7, 9, 2, 4, 6, 8, 10]]", expected_output: "9\n" },
            { stdin: "[[42, 42, 41]]", expected_output: "41\n" },
            { stdin: "[[10, -10, 10, -10]]", expected_output: "-10\n" },
            { stdin: "[[5, 4, 3, 2, 1, 0]]", expected_output: "4\n" },
            { stdin: "[[1000, 1000]]", expected_output: "Not Found\n" },
            { stdin: "[[0, -1, -2]]", expected_output: "-1\n" },
            { stdin: "[[1.5, 2.5, 3.5]]", expected_output: "2.5\n" },
            { stdin: "[[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]]", expected_output: "90\n" },
            { stdin: "[[99, 100, 99]]", expected_output: "99\n" }
        ]
    }
};

const waitAllFinished = async (tokens: any) => {
    const MAX_RETRIES = 10;
    const INTERVAL = 1500;

    for (let i = 0; i < MAX_RETRIES; i++) {
        const response = await axios.get(`${JUDGE0_URL}/submissions/batch?tokens=${tokens}&base64_encoded=true`);
        const submissions = response.data.submissions;

        const isAllFinished = submissions.every((s: { status: { id: number; }; }) => s.status.id > 2);

        if (isAllFinished) {
            return submissions;
        }

        await new Promise(resolve => setTimeout(resolve, INTERVAL));
    }
    throw new Error("Hệ thống quá tải, thực thi vượt quá thời gian cho phép.");
};

export class SubmissionController {
    static async runCode(req: any, res: Response) {
        try {
            const { code, language_id } = req.body;

            const response = await axios.post(`${JUDGE0_URL}/submissions?wait=true`, {
                source_code: code,
                language_id: language_id || 63,
                base64_encoded: false,

                wall_time_limit: 10,
                enable_per_process_and_thread_memory_limit: false
            });

            res.json(response.data);
        } catch (err) {
            console.log(err);

            res.status(500).json({ error: err.message });
        }
    }

    static async submitCode(req: any, res: Response) {
        try {
            const { encryptedData } = req.body;
            const { code, testCases } = decryptData(encryptedData);

            const finalCode = `
            const fs = require('fs');
            const __input = fs.readFileSync(0, 'utf8').trim();

            (() => {
                ${code}
                
                if (__input && typeof solve === 'function') {
                    try {
                        const args = JSON.parse(__input);
                        const result = solve(...args);
                        if (result !== undefined) process.stdout.write(String(result) + "\\n");
                    } catch (e) {
                        process.stderr.write("Input Error: " + e.message);
                    }
                }
            })();
        `;

            const submissions = testCases.map((tc: { input: any; expectedOutput: any; }) => ({
                language_id: 63,
                source_code: Buffer.from(finalCode).toString('base64'),
                stdin: Buffer.from(tc.input || "").toString('base64'),
                expected_output: Buffer.from(tc.expectedOutput).toString('base64')
            }));

            const postResponse = await axios.post(`${JUDGE0_URL}/submissions/batch?base64_encoded=true`, {
                submissions
            });

            const tokens = postResponse.data.map((s: { token: any; }) => s.token).join(',');
            const finalResults = await waitAllFinished(tokens);

            res.setHeader("x-encrypted", "true");
            res.status(200).json({
                success: true, encryptedData: encryptData({
                    success: finalResults.every((r: { status: { id: number; }; }) => r.status.id === 3),
                    testcases: finalResults
                })
            });
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getMySubmissions(req: any, res: Response) {
        const submissions = await SubmissionService.getByUser(
            req.user._id
        );
        res.json(submissions);
    }

    static async getById(req: Request, res: Response) {
        const submission = await SubmissionService.getById(req.params.id);
        res.json(submission);
    }
}
