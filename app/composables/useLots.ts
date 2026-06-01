import type { ICatalogResponce } from '~/types/lots'

export const useLots = (
  offset: Ref<number> | ComputedRef<number>,
  limit: number,
  sortBy: Ref<string> | ComputedRef<string> = ref('default'),
) => {
  const url = computed(() => {
    const base =
      sortBy.value && sortBy.value !== 'default'
        ? 'https://api.example.com/catalog/sorted'
        : 'https://api.example.com/catalog'

    let urlString = `${base}?offset=${offset.value}&limit=${limit}`
    if (sortBy.value && sortBy.value !== 'default') {
      urlString += `&sort=${sortBy.value}`
    }
    return urlString
  })
  const { data, pending, error } = useFetch<ICatalogResponce>(url, {
    // Если offset/limit могут меняться реактивно, добавьте watch
    watch: [offset, sortBy],
    server: false,
  })

  return {
    items: computed(() => data.value?.items ?? []),
    total: computed(() => data.value?.total ?? 0),
    hasMore: computed(() => data.value?.hasMore ?? false),
    pending,
    error,
  }
}
