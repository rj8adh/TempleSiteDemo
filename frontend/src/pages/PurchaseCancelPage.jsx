import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PurchaseCancelPage = () => {
    return (
        <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-card ring-1 ring-border rounded-2xl shadow-sm p-10 text-center">
                <div className="bg-red-50 dark:bg-red-950/30 rounded-full p-4 w-fit mx-auto mb-6">
                    <XCircle className="text-red-500 w-10 h-10" />
                </div>

                <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
                    Offering Cancelled
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    No worries — your transaction was not processed. If you had
                    trouble with payment, please try again or reach out to us.
                </p>

                <Link to="/cart">
                    <Button className="w-full gap-2 rounded-xl h-11">
                        <ArrowLeft size={15} />
                        Return to Cart
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default PurchaseCancelPage;
