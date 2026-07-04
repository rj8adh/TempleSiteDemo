import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { databases, DATABASE_ID, ARTICLE_COLLECTION_ID } from "../appwrite"; // 1. Direct Appwrite import
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ArticlePage = () => {
    const { slug } = useParams(); // This holds your Appwrite document ID now
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // 2. Query Appwrite directly using the document ID (slug)
                const doc = await databases.getDocument(DATABASE_ID, ARTICLE_COLLECTION_ID, slug);
                setArticle(doc);
            } catch (err) {
                console.error("Error fetching article from Appwrite:", err);
                setError(true);
            }
        };
        if (slug) fetchArticle();
    }, [slug]);

    if (error) {
        return (
            <div className="min-h-screen bg-parchment pt-28 pb-16 px-4 text-center">
                <p className="text-muted-foreground">Article not found.</p>
                <Link to="/learn-more" className="text-primary underline mt-4 inline-block">
                    Back to Learn More
                </Link>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-parchment pt-28 pb-16 px-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    <Skeleton className="h-10 w-2/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                    <Skeleton className="h-4 w-4/6 rounded" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-parchment pt-28 pb-16 px-4"
        >
            <div className="max-w-3xl mx-auto">
                {/* Back link */}
                <Link
                    to="/learn-more"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={14} />
                    Back to Learn More
                </Link>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {article.category && (
                        <Badge
                            variant="outline"
                            className="border-primary/60 text-primary tracking-[0.15em] uppercase text-xs"
                        >
                            {article.category}
                        </Badge>
                    )}
                    {article.readTime && (
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    )}
                </div>

                {/* Title */}
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                    {article.title}
                </h1>

                {/* Marigold rule */}
                <div className="w-14 h-0.5 bg-primary rounded-full mb-10" />

                {/* Body */}
                <div
                    className="prose prose-stone max-w-none text-foreground leading-relaxed
                               prose-headings:font-heading prose-headings:text-foreground
                               prose-a:text-primary prose-strong:text-foreground
                               prose-img:rounded-xl prose-img:shadow-sm"
                    // 3. Fallback to normal text rendering if content is not raw HTML
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />
            </div>
        </motion.div>
    );
};

export default ArticlePage;