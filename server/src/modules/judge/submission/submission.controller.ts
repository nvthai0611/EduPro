import { Request, Response } from "express";
import { SubmissionService } from "./submission.service";
import axios from "axios";
import { decryptData, encryptData } from "../../../utils/encryption";

const JUDGE0_URL = process.env.JUDGE0_URL;

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
            const { code, language_id, cpu_time_limit, memory_limit } = req.body;

            const response = await axios.post(`${JUDGE0_URL}/submissions?wait=true`, {
                source_code: code,
                language_id: language_id || 63,
                base64_encoded: false,
                cpu_time_limit: cpu_time_limit || 1,
                memory_limit: memory_limit || 128000,

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
            const { code, testCases, cpu_time_limit, memory_limit } = decryptData(encryptedData);

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
                expected_output: Buffer.from(tc.expectedOutput).toString('base64'),
                cpu_time_limit: cpu_time_limit || 1,
                memory_limit: memory_limit || 128000,
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

    static async saveSubmission(req: any, res: Response) {
        const submission = await SubmissionService.create(req.body);
        res.json(submission);
    }

    static async getMySubmissions(req: any, res: Response) {
        const submissions = await SubmissionService.getByUser(
            req.user.userId
        );
        res.json(submissions);
    }

    static async getById(req: Request, res: Response) {
        const submission = await SubmissionService.getById(req.params.id);
        res.json(submission);
    }

    static async getByUserAndProblem(req: Request, res: Response) {
        const { userId, problemId } = req.params;
        const submission = await SubmissionService.getByUserAndProblem(userId, problemId);
        res.json(submission);
    }
}
