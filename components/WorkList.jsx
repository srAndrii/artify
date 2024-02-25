import React, {useState} from "react";
import WorkCard from "./WorkCard";
import "@styles/WorkList.scss";

const WorkList = ({data}) => {
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(data.length / itemsPerPage);

    const startOffset = (currentPage - 1) * itemsPerPage;
    let startCount = 0;

    return (
        <>
            <div className='work-list'>
                {data
                    .slice(startOffset, startOffset + itemsPerPage)
                    .map((work) => {
                        startCount++;
                        return <WorkCard key={work._id} work={work} />;
                    })}
            </div>
            {maxPage > 1 && (
                <div className='pagination'>
                    {Array.from({length: maxPage}, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "active" : ""}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            )}
        </>
    );
};

export default WorkList;
