import { URLSearchToCriteria } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria"

describe('urlsearch-to-criteria.test', () => {
    it('should be defined', () => {
        const url = "";
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);

    })
})