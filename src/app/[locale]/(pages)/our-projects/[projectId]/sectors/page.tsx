import ShowSectors from "./ShowSectors";

type PageParams = Promise<{ projectId: number }>;

const SectorsPage = async ({ params }: { params: PageParams }) => {
	const { projectId } = await params;

	return (
		<>
			<ShowSectors projectId={projectId} />
		</>
	);
};

export default SectorsPage;
