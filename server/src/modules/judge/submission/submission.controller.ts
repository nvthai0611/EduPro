import { Request, Response } from "express";
import { SubmissionService } from "./submission.service";
import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com";

const problems = {
    "01": {
        id: "01",
        title: "Chào mừng đến với JavaScript",
        testcases: [
            { stdin: "", expected_output: "Hello World\n" },
            { stdin: "", expected_output: "Hello World" },
            { stdin: "", expected_output: "He11o Wor1d" }
        ]
    }
};

const waitAllFinished = async (tokens: string) => {
    const MAX_RETRIES = 10; // Thử tối đa 10 lần
    const INTERVAL = 1500;   // Mỗi lần cách nhau 1.5 giây

    for (let i = 0; i < MAX_RETRIES; i++) {
        // Lấy trạng thái của tất cả tokens
        const response = await axios.get(`${JUDGE0_URL}/submissions/batch?tokens=${tokens}&base64_encoded=true`);
        const submissions = response.data.submissions;

        // Kiểm tra xem tất cả đã xong chưa (status id 1 là In Queue, 2 là Processing)
        const isAllFinished = submissions.every((s: { status: { id: number; }; }) => s.status.id > 2);

        if (isAllFinished) {
            return submissions;
        }

        // Đợi một khoảng thời gian trước khi thử lại
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
    // const submission = await SubmissionService.create({
    //   ...req.body,
    //   userId: req.user._id, // từ auth middleware
    // });
    try {
        const { problemId, code, language_id } = req.body;
        const problem = problems[problemId];

        const submissions = problem.testcases.map((tc: { stdin: any; expected_output: any; }) => ({
            language_id: language_id || 63,
            source_code: Buffer.from(code).toString('base64'), // Nên dùng base64 để tránh lỗi ký tự
            stdin: Buffer.from(tc.stdin).toString('base64'),
            expected_output: Buffer.from(tc.expected_output).toString('base64')
        }));

        const postResponse = await axios.post(`${JUDGE0_URL}/submissions/batch?base64_encoded=true`, {
            submissions
        });

        const tokens = postResponse.data.map((s: { token: any; }) => s.token).join(',');

        const finalResults = await waitAllFinished(tokens);

        const allPassed = finalResults.every((r: { status: { id: number; }; }) => r.status.id === 3);

        res.json({
            success: allPassed,
            testcases: finalResults
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
