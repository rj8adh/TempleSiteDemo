import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useArticleStore } from "../stores/useArticleStore"; // Import your Appwrite Zustand store!
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1597040663342-45b326432694?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80",
];

function getArticleImage(article, index) {
    return article.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card"
                >
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="px-4 py-4 space-y-3">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex justify-between pt-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ArticleCard({ article, index }) {
    // Swapped article.slug to article._id so it perfectly maps to your Appwrite document ID
    return (
        <Link to={`/learn-more/${article._id}`} className="block h-full">
            <Card className="card-glow h-full cursor-pointer hover:ring-primary/40">
                <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                        src={getArticleImage(article, index)}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <CardHeader className="pt-4">
                    {article.category && (
                        <Badge
                            variant="outline"
                            className="w-fit mb-1 border-primary/50 text-primary"
                        >
                            {article.category}
                        </Badge>
                    )}
                    <CardTitle className="text-base leading-snug line-clamp-2">
                        {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                        {article.excerpt || article.content?.substring(0, 100) + "..."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                    <div className="flex items-center justify-between">
                        {article.readTime && (
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                                {article.readTime}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-primary ml-auto">
                            Read More <ArrowRight size={13} />
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function ArticleGrid({ articles }) {
    // Guarantees an array backup if state is handling initial async transitions
    const safeArticles = Array.isArray(articles) ? articles : [];

    if (safeArticles.length === 0) {
        return (
            <p className="text-center text-muted-foreground py-24">
                No articles published yet. Check back soon.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeArticles.map((article, index) => (
                <ArticleCard
                    key={article._id || article.$id}
                    article={article}
                    index={index}
                />
            ))}
        </div>
    );
}

const LearnMorePage = () => {
    // Pull clean serverless actions directly from your Zustand store wrapper
    const { articles, loading, fetchAllArticles } = useArticleStore();

    useEffect(() => {
        fetchAllArticles();
    }, [fetchAllArticles]);

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 bg-parchment">
            <div className="max-w-6xl mx-auto">
                <PageHeader
                    badge="Wisdom, Culture, & Traditions"
                    title="Learn More"
                    subtitle="Read our blog posts to learn more about our temple, culture, history, and traditions."
                />

                {loading ? <SkeletonGrid /> : <ArticleGrid articles={articles} />}
            </div>
        </div>
    );
};

export default LearnMorePage;