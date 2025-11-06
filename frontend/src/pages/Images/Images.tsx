import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { $api, fetchClient } from '../../api.ts';
import { useHeader } from '../../contexts/useHeader.ts';
import VirtualGrid from '../../components/VirtualGrid/VirtualGrid.tsx';
import Image from '../../components/Image/Image.tsx';
import TagFilter from '../../components/TagFilter/TagFilter.tsx';

const CHUNK_SIZE = 10;
const TAG_PARAM_KEY = 'tag';

function ImagesPage() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const searchParams = urlSearchParams.get(TAG_PARAM_KEY) || '';
  const { setIsLoading, setMeta } = useHeader();

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isFetched, isFetchedAfterMount, error } =
    $api.useInfiniteQuery('get', '/api/images', {}, {
      initialPageParam: 0,
      queryKey: ['images', searchParams],
      // Using queryFn because default useInfiniteQuery don't support dynamic params yet
      queryFn: async ({ pageParam = 0 }) => {
        const queryParams: { from: number; limit: number; tag?: string } = {
          from: pageParam,
          limit: CHUNK_SIZE,
        };

        if (searchParams) {
          queryParams.tag = searchParams;
        }

        const response = await fetchClient.GET('/api/images', { params: { query: queryParams } });
        return response.data;
      },
      getNextPageParam: (lastPage) => {
        // No more pages
        if (lastPage.from + lastPage.imagesCount >= lastPage.imagesTotal) {
          return null;
        }

        // Next page
        return lastPage.from + lastPage.imagesCount;
      },
    }
  );

  const loadMoreHandler = async () => {
    if (!hasNextPage || isFetching) {
      return;
    }

    await fetchNextPage();
  };

  const tagClickHandler = (tag: string) => {
    setUrlSearchParams({ [TAG_PARAM_KEY]: tag });
  };

  const clearFilterHandler = () => {
    const newParams = new URLSearchParams(urlSearchParams);
    newParams.delete(TAG_PARAM_KEY);
    setUrlSearchParams(newParams);

    window.scrollTo(0, 0);
  };

  const meta = useMemo(() => {
    if (!data || !data.pages || data.pages.length === 0) {
      return ['No information'];
    }

    const lastPage = data.pages[data.pages.length - 1];
    if (!lastPage) {
      return ['No information'];
    }

    const isCached = !!data && isFetched && !isFetchedAfterMount;
    const totalLoaded = data.pages.reduce((sum, page) => sum + page.imagesCount, 0);
    return ([
      `isLastCached: ${isCached} • hasMore: ${hasNextPage ? 'Yes' : 'No'}`,
      `last: ${lastPage.imagesCount} • total: ${totalLoaded}/${lastPage.imagesTotal} (pages: ${data.pages.length})`,
    ]);
  }, [data, hasNextPage, isFetched, isFetchedAfterMount]);

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching, setIsLoading]);

  useEffect(() => {
    setMeta(meta);

    return () => {
      setMeta([]);
    };
  }, [meta, setMeta]);

  const totalImages = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) {
      return 0;
    }
    return data.pages[data.pages.length - 1]?.imagesTotal || 0;
  }, [data])


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred :(</div>;
  }

  return (
    <>
      <TagFilter tag={searchParams} onClear={clearFilterHandler} />
      {totalImages === 0 && <div>No images found</div>}
      <VirtualGrid
        columns={3}
        overscan={3}
        onEndOfList={loadMoreHandler}
      >
        {
          data?.pages.map(
            page => page.images.map(
              image =>
                <Image
                  src={image.url}
                  name={image.name}
                  tags={image.tags}
                  key={image.name}
                  onTagClick={tagClickHandler}
                />
            )
          )
        }
      </VirtualGrid>
    </>
  )
}

export default ImagesPage;
