import AnimalCardSkeleton from "@/shared/skeleton/animalCardSkeleton";
import { Button } from "@/shared/ui/button";
import ShelterCard from "@/entities/shelter/ui/shelterCard";
import { cn } from "@/lib/utils";
import { queryGetAllShelters } from "@/entities/shelter/model/query/sheltersAllByPage";
import { ShelterType } from "@/entities/shelter/model/type";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { sheltersPerPage } from "@/constants/counts";

type Props = { className?: string; shelterSearchParams: SearchParamsType };

const Index = ({ className, shelterSearchParams }: Props) => {
	const t = useTranslations();
	// query to get shelters
	const [shelters, setShelters] = useState<ShelterType[]>([]);

	const {
		fetchNextPage,
		data: fetchedShelters,
		isLoading: isShelterssLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllShelters({ searchParams: shelterSearchParams });

	// list of shelters memoizations
	useMemo(() => {
		const initialShelters = fetchedShelters?.pages.map((pages) => pages?.shelters || []).flat() ?? [];

		setShelters(initialShelters);
	}, [fetchedShelters]);

	return (
		<div className={cn(className)}>
			{!isShelterssLoading ? (
				<div className="flex justify-center">
					{shelters && shelters.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-2 gap-4">
								{shelters.map((shelter: ShelterType) => {
									return (
										<ShelterCard
											isEditable={false}
											key={shelter._id.toString()}
											shelter={shelter}
										/>
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: sheltersPerPage }, (_, index) => (
											<AnimalCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{hasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => fetchNextPage()}>{t("loadMore")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("noAnimals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: sheltersPerPage }, (_, index) => (
						<AnimalCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
