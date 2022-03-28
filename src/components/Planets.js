import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Planet from './Planet';

const fetchPlanets = async page => {
  const res = await fetch(`http://swapi.dev/api/planets/?page=${page}`);
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const { data, status, isPreviousData } = useQuery(['planets', page], () => fetchPlanets(page), {
    onSuccess: data => setCount(data.count / 10),
  });

  console.log(data);

  return (
    <div>
      <h2>Planets</h2>
      {!!count && (
        <>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          {[...Array(count).keys()].map(p => (
            <span onClick={() => setPage(p + 1)} className={'page-num' + (page === p + 1 ? ' selected' : '')}>
              {p + 1}
            </span>
          ))}
          <button disabled={isPreviousData || !data?.next} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </>
      )}
      {status === 'loading' && <div>Loading data...</div>}
      {status === 'error' && <div>Error fetching data</div>}
      {status === 'success' && (
        <div>{data.results && data.results.map(planet => <Planet key={planet.name} planet={planet} />)}</div>
      )}
    </div>
  );
};

export default Planets;
