import { Badge } from "@/components/ui/badge";

/**
 * Canonical page header used across every interior page.
 *
 * Usage:
 *   <PageHeader
 *     badge="Sacred Knowledge"
 *     title="Wisdom & Culture"
 *     subtitle="Deepen your understanding of our sacred traditions."
 *   />
 *
 * `subtitle` is optional.
 * `className` is merged onto the outer wrapper for per-page overrides.
 */
export default function PageHeader({ badge, title, subtitle, className = "" }) {
    return (
        <div className={`text-center mb-16 ${className}`}>
            <Badge
                variant="outline"
                className="mb-4 border-primary/60 text-primary tracking-[0.25em] uppercase text-xs"
            >
                {badge}
            </Badge>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
            <div className="mt-6 mx-auto w-16 h-0.5 bg-primary rounded-full" />
        </div>
    );
}
