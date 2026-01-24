import PostReactions from "./models/post-reactions.model";
import Posts from "./models/post.model";

class postRepository {
  // Repository methods here
  async findAllPosts(
    query: any = {},
    options: any = {},
  ): Promise<{
    posts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      select,
      populate,
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Build the query
    const queryBuilder = Posts.find(query);

    // Apply select if provided
    if (select) {
      queryBuilder.select(select);
    }

    // Apply populate if provided
    if (populate) {
      queryBuilder.populate(populate);
    }

    // Execute query with pagination
    const posts = await queryBuilder.sort(sort).skip(skip).limit(limit).lean();

    // Get total count for pagination metadata
    const total = await Posts.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
  }
  async findPostById(id: string) {
    // Implementation to find a post by ID
    return Posts.findById(id).lean();
  }
  async findPostsByUser(userId: string) {
    // Implementation to find posts by user ID
    return Posts.find({ authorId: userId }).lean();
  }
  async findPostsByCategory(categoryId: string) {
    // Implementation to find posts by category ID
    return Posts.find({ categoryId }).lean();
  }
  async findPostsByTag(tag: string) {
    // Implementation to find posts by tag
    return Posts.find({ tags: tag }).lean();
  }
  async findPostBySlug(slug: string) {
    // Implementation to find a post by slug
    return Posts.findOne({ slug }).lean();
  }
  async createPost(data: any) {
    // Implementation to create a new post
    return Posts.create(data);
  }
  async deletePost(id: string) {
    // Implementation to delete a post by ID
    return Posts.findByIdAndDelete(id);
  }
  async updatePost(id: string, data: any) {
    // Implementation to update a post by ID
    return Posts.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true },
    );
  }

  async findTrendingPosts(dateThreshold: Date, limit: number): Promise<any[]> {
    return await Posts.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold },
        },
      },
      {
        $addFields: {
          // Calculate engagement score: likes + (comments * 2) + (views * 0.1)
          engagementScore: {
            $add: [
              { $ifNull: ["$likesCount", 0] },
              { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 2] },
              { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.1] },
            ],
          },
        },
      },
      {
        $sort: { engagementScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          coverImageUrl: 1,
          authorId: 1,
          authorName: 1,
          likesCount: 1,
          commentsCount: 1,
          viewsCount: 1,
          tags: 1,
          createdAt: 1,
          engagementScore: 1,
          "author.username": 1,
          "author.avatar": 1,
        },
      },
    ]);
  }

  async findFeaturedPosts(limit: number): Promise<any[]> {
    return await Posts.aggregate([
      {
        $addFields: {
          // Featured score: higher weight on recent posts with good engagement
          featuredScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$likesCount", 0] }, 3] },
              { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 5] },
              { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.2] },
              // Boost recent posts
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: [new Date(), "$createdAt"] },
                      86400000, // milliseconds in a day
                    ],
                  },
                  -10, // Negative to prefer recent posts
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { featuredScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          coverImageUrl: 1,
          authorId: 1,
          authorName: 1,
          likesCount: 1,
          commentsCount: 1,
          viewsCount: 1,
          tags: 1,
          createdAt: 1,
          featuredScore: 1,
          "author.username": 1,
          "author.avatar": 1,
        },
      },
    ]);
  }

  // Post reaction
  async findUserReactions(userId: string, postId: string) {
    return PostReactions.find({ userId, postId }).lean();
  }

  async createPostReaction(data: any) {
    // Implementation to create a new post reaction
    const reaction = await PostReactions.create(data);

    // Update count in Post
    const countField = data.type === "LIKE" ? "likesCount" : "savesCount";
    await Posts.findByIdAndUpdate(data.postId, { $inc: { [countField]: 1 } });

    return reaction;
  }

  async deletePostReaction(id: string) {
    // Implementation to delete a post reaction by ID
    const reaction = await PostReactions.findByIdAndDelete(id);
    if (reaction) {
      // Update count in Post
      const countField = reaction.type === "LIKE" ? "likesCount" : "savesCount";
      await Posts.findByIdAndUpdate(reaction.postId, {
        $inc: { [countField]: -1 },
      });
    }
    return reaction;
  }

  async deleteUserReaction(userId: string, postId: string, type: string) {
    const reaction = await PostReactions.findOneAndDelete({
      userId,
      postId,
      type,
    });
    if (reaction) {
      const countField = type === "LIKE" ? "likesCount" : "savesCount";
      await Posts.findByIdAndUpdate(postId, { $inc: { [countField]: -1 } });
    }
    return reaction;
  }
}

export const PostRepository = new postRepository();
