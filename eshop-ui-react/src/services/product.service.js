import http from '../http-common';
import {apiUrls} from '../api-urls';
import {buildUrl} from '../utils/url-utils';

class ProductService {

    basicUrl = apiUrls.API_PRODUCTS;

    getAll() {
        return http.get(this.basicUrl);
    }

    search(offeringId, categoryId, name, page, pageSize) {
        const queryParameters = new Map();
        queryParameters.set('offeringId', offeringId);
        queryParameters.set('categoryId', categoryId);
        queryParameters.set('name', name);
        queryParameters.set('page', page);
        queryParameters.set('pageSize', pageSize);
        const url = buildUrl(`${this.basicUrl}/search`, queryParameters);
        return http.get(url);
    }

    getById(id) {
        const url = `${this.basicUrl}/${id}`;
        return http.get(url);
    }

    create(product) {
        return http.post(this.basicUrl, product);
    }

    update(product) {
        return http.put(this.basicUrl, product);
    }

    delete(id) {
        const url = `${this.basicUrl}/${id}`;
        return http.delete(url);
    }
}

export default new ProductService();
