import { model, Schema, Types } from "mongoose";
import { generateSlug } from "../../../utils/slug";


export interface IForum{
    title: string;
    slug: string;
    content: string;
    authorId: Types.ObjectId;
    authorName: string;
    coverImageUrl?: string;
    contentImageUrls?: string[];
    tags?: string[];
    // Like and save posts count
    likesCount: number;
    savesCount: number;
    viewsCount: number; // Track unique views
    // New fields for Answer/Comment system
    answersCount: number;
    commentsCount: number; // Semantics: Total comments (post + its answers)
    acceptedAnswerId?: Types.ObjectId;

    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // Add other fields as necessary
}

export interface IForumDocument extends IForum {
    // You can add instance methods here if needed in the future
}


const ForumSchema = new Schema<IForumDocument>(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true, lowercase: true, trim: true },
        content: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, trim: true },
        coverImageUrl: { type: String },
        contentImageUrls: { type: [String], default: [] },
        tags: { type: [String], default: [] },

        //Like and save posts count
        likesCount: { type: Number, default: 0 },
        savesCount: { type: Number, default: 0 },
        viewsCount: { type: Number, default: 0 },
        
        // New fields
        answersCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        acceptedAnswerId: { type: Schema.Types.ObjectId, ref: "Answer" },

        isDeleted: { type: Boolean, default: false },
    },
    {
        collection: "Posts",
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for performance optimization at scale

// Index for author queries
ForumSchema.index({ authorId: 1, createdAt: -1 });

// Index for tag-based queries
ForumSchema.index({ tags: 1, createdAt: -1 });

// Text index for search functionality
ForumSchema.index({ title: "text", content: "text" });

// Index for trending posts (by engagement)
ForumSchema.index({ likesCount: -1, commentsCount: -1 });

ForumSchema.pre("save", async function (next) {
  if (this.isModified("title") && !this.slug) {
    // Generate slug from title
    const baseSlug = generateSlug(this.title);
    
    // Add timestamp and random string for uniqueness
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8); // 6 random chars
    const slug = `${baseSlug}-${timestamp}-${randomStr}`;
    
    this.slug = slug;
  }
  next();
});

const Posts = model<IForumDocument>("Posts", ForumSchema);

export default Posts;