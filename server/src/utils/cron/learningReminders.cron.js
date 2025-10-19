const cron = require("node-cron");
const UserProgress = require("../../models/user_progress.model");
const User = require("../../models/user.model");
const Course = require("../../models/course.model");
const { sendEmail } = require("../email");

// Cron job to send learning reminders
cron.schedule("0 9 * * *", async () => {
  console.log("Running learning reminder cron job...");
  
  try {
    // Find users who haven't watched any lessons in the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const inactiveUsers = await UserProgress.find({
      lastWatchedLesson: { $exists: true },
      updatedAt: { $lt: threeDaysAgo },
    }).populate("userId", "email fullName").populate("courseId", "title");

    for (const progress of inactiveUsers) {
      if (progress.userId.email) {
        await sendEmail({
          to: progress.userId.email,
          subject: "Tiếp tục học tập - Hoàng An IT Academy",
          html: `
            <h2>Xin chào ${progress.userId.fullName}!</h2>
            <p>Chúng tôi nhận thấy bạn đã không học khóa học <strong>${progress.courseId.title}</strong> trong 3 ngày qua.</p>
            <p>Hãy tiếp tục hành trình học tập của bạn để đạt được mục tiêu!</p>
            <a href="${process.env.FRONTEND_URL}/learn/${progress.courseId._id}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Tiếp tục học ngay
            </a>
            <p>Chúc bạn học tập hiệu quả!</p>
            <p>Hoàng An IT Academy</p>
          `,
        });
      }
    }

    console.log(`Sent learning reminders to ${inactiveUsers.length} users`);
  } catch (error) {
    console.error("Error in learning reminder cron:", error);
  }
});

// Cron job to send course completion congratulations
cron.schedule("0 10 * * *", async () => {
  console.log("Running course completion congratulations cron job...");
  
  try {
    // Find users who completed courses yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedProgress = await UserProgress.find({
      progress: 100,
      updatedAt: { $gte: yesterday, $lt: today },
    }).populate("userId", "email fullName").populate("courseId", "title");

    for (const progress of completedProgress) {
      if (progress.userId.email) {
        await sendEmail({
          to: progress.userId.email,
          subject: "Chúc mừng bạn đã hoàn thành khóa học! 🎉",
          html: `
            <h2>Chúc mừng ${progress.userId.fullName}! 🎉</h2>
            <p>Bạn đã hoàn thành khóa học <strong>${progress.courseId.title}</strong>!</p>
            <p>Thành tích này thật đáng tự hào. Hãy tiếp tục học tập để nâng cao kỹ năng của bạn.</p>
            <a href="${process.env.FRONTEND_URL}/courses" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Khám phá khóa học mới
            </a>
            <p>Chúc bạn thành công trong sự nghiệp!</p>
            <p>Hoàng An IT Academy</p>
          `,
        });
      }
    }

    console.log(`Sent completion congratulations to ${completedProgress.length} users`);
  } catch (error) {
    console.error("Error in completion congratulations cron:", error);
  }
});

console.log("Learning platform cron jobs initialized");
