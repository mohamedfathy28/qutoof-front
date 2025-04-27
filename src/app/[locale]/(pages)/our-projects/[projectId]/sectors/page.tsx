import ShowSectors from "./ShowSectors";

type PageParams = Promise<{ projectId: number }>;

const SectorsPage = async ({ params }: { params: PageParams }) => {
	const { projectId } = await params;

	console.log("======= project id =======>" + projectId);

	return (
		<>
			<ShowSectors projectId={projectId} />
		</>
	);
};

export default SectorsPage;
