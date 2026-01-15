import { model, Schema, Types } from "mongoose";
import { generateSlug } from "../../utils/slug";


export interface IForum{
    title: string;
    slug: string;
    content: string;
    authorId: Types.ObjectId;
    authorName: string;
    coverImageUrl?: string;
    contentImageUrls?: string[];
    tags?: string[];
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
        isDeleted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        collection: "forums",
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
ForumSchema.pre("save", async function (next) {
  if (this.isModified("title") && !this.slug) {
    // Generate slug from title
    const baseSlug = generateSlug(this.title);
    
    // Check for uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await model("forums").findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

const Forum = model<IForumDocument>("forums", ForumSchema);

export default Forum;