import SectorDetails from "./SectorDetails";



type PageParams = Promise<{ sectorId: number }>;
const SectorDetailsPage = async ({ params }: { params: PageParams }) => {

    const { sectorId } = await params;



    return (
        <>
            <SectorDetails sectorId={sectorId} />
        </>

    );
};

export default SectorDetailsPage