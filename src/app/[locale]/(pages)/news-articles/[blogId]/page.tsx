import BlogDetails from "./BlogDetails";

type BlogDetailsPageParams = Promise<{ blogId: number }>;

const BlogDetailsPage = async ({
	params,
}: {
	params: BlogDetailsPageParams;
}) => {
	const { blogId } = await params;

	return (
		<>
			<BlogDetails blogId={blogId} />
		</>
	);
};

export default BlogDetailsPage;
