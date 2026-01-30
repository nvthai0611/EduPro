import PostReactions from "./models/post-reactions.model";
import Posts from "./models/post.model";
import PostViews from "./models/post-views.model";

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
      featured = false
    } = options;

    const skip = (page - 1) * limit;

    // Determine sort based on options
    let sortStage: any = {};
    if (featured) {
      sortStage = { featuredScore: -1 };
    } else if (sortBy === 'engagement') {
      sortStage = { engagementScore: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sortStage = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const pipeline: any[] = [
      { $match: query },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$likesCount", 0] }, 0.5] },
              { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 10] },
              { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.05] },
            ],
          },
          // Calculate featured score regardless (so we can sort by it if needed)
          featuredScore: {
               $add: [
                  { $multiply: [{ $ifNull: ["$likesCount", 0] }, 3] },
                  { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 5] },
                  { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.2] },
                  {
                    $multiply: [
                       {
                        $divide: [
                          { $subtract: [new Date(), "$createdAt"] },
                          86400000 
                        ]
                       },
                       -10
                    ]
                  }
               ]
          }
        },
      },
      { $sort: sortStage },
      // Pagination with $facet to get count and data in one go
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
               $lookup: {
                 from: "users",
                 localField: "authorId",
                 foreignField: "_id",
                 as: "author"
               }
            },
            {
               $unwind: {
                 path: "$author",
                 preserveNullAndEmptyArrays: true
               }
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
                answersCount: 1,
                savesCount: 1,
                engagementScore: 1,
                featuredScore: 1,
                "author.username": 1,
                "author.avatar": 1,
                "author.fullName": 1
              }
            }
          ]
        }
      }
    ];

    const result = await Posts.aggregate(pipeline);
    
    const metadata = result[0].metadata[0];
    const total = metadata ? metadata.total : 0;
    const posts = result[0].data;
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

  async findTrendingPosts(
    dateThreshold: Date,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    posts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $match: {
          createdAt: { $gte: dateThreshold },
        },
      },
      {
        $addFields: {
   
          engagementScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$likesCount", 0] }, 0.5] },
              { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 10] },
              { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.05] },
            ],
          },
        },
      },
      {
        $sort: { engagementScore: -1 },
      },
    ];

    // Get total count
    const countResult = await Posts.aggregate([...pipeline, { $count: "total" }]);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const posts = await Posts.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
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

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findFeaturedPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    posts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
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
    ];

    // Get total count
    const countResult = await Posts.aggregate([...pipeline, { $count: "total" }]);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const posts = await Posts.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
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

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
    };
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

  // Post view tracking methods
  async findExistingView(postId: string, viewerId: string) {
    return PostViews.findOne({ postId, viewerId }).lean();
  }

  async createPostView(postId: string, viewerId: string) {
    try {
      const view = await PostViews.create({
        postId,
        viewerId,
        viewedAt: new Date(),
      });
      return view;
    } catch (error: any) {
      // Duplicate key error (code 11000) means view already exists
      if (error.code === 11000) {
        return null; // Already viewed
      }
      throw error;
    }
  }

  async incrementViewCount(postId: string) {
    return Posts.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
  }

  
}

export const PostRepository = new postRepository();
