import type { ICatalogResponce } from '~/types/lots'

export const useLots = (
  offset: Ref<number> | ComputedRef<number>,
  limit: number,
) => {
  const { data, pending, error } = useFetch<ICatalogResponce>(
    () =>
      `https://api.example.com/catalog?offset=${offset.value ?? offset}&limit=${limit}`,
    {
      // Если offset/limit могут меняться реактивно, добавьте watch
      watch: [],
      server: false,
    },
  )

  return {
    items: computed(() => data.value?.items ?? []),
    total: computed(() => data.value?.total ?? 0),
    hasMore: computed(() => data.value?.hasMore ?? false),
    pending,
    error,
  }
}
