import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function BlogDetailsLoading() {
    return (
        <div className="min-h-screen bg-gray-50/60 pb-20 pt-24">
            <div className="mx-auto max-w-4xl px-4">
                <LoadingSpinner fullScreen label="Loading article..." size={52} />
            </div>
        </div>
    );
}
