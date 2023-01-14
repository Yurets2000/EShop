import './product-block.component.css';
import React, {Component} from "react";
import ProductCategoriesService from "../../services/product-category.service";
import ProductService from '../../services/product.service';
import ProductItem from '../product-item/product-item.component';
import {sort} from '../../utils/list-utils';
import {containsAllKeysAnyValues} from '../../utils/map-utils';
import emptyStock from '../../assets/img/empty-stock.png';

export default class ProductBlock extends Component {

    constructor(props) {
        super(props);
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.retrieveProductCategories = this.retrieveProductCategories.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
        this.updateProductsStateFromOffering = this.updateProductsStateFromOffering.bind(this);
        this.updateProductsStateFromFilteringParams = this.updateProductsStateFromFilteringParams.bind(this);
        this.filterProducts = this.filterProducts.bind(this);

        this.state = {
            productCategories: [],
            products: [],
            filteringParams: null,
            offering: null
        }
    }

    componentDidMount() {
        this.retrieveProductCategories();
        this.updateStateFromProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {
        if (!!props.data.filteringParams && props.data.filteringParams !== this.state.filteringParams) {
            this.setState({
                filteringParams: props.data.filteringParams,
            });
            this.updateProductsStateFromFilteringParams(props.data.filteringParams);
        }
        if (!!props.data.offering && props.data.offering !== this.state.offering) {
            this.setState({
                offering: props.data.offering,
            });
            this.updateProductsStateFromOffering(props.data.offering);
        }
    }

    retrieveProductCategories() {
        ProductCategoriesService.getAll()
            .then(response => {
                this.setState({
                    productCategories: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    searchProducts(offeringId, categoryId, name, characteristicsMap) {
        ProductService.search(offeringId, categoryId, name, 0, 20)
            .then(response => {
                    console.log(`searchProducts, offeringId: ${offeringId}, categoryId: ${categoryId}, name: ${name}, 
                    characteristicMap: ${JSON.stringify(Object.fromEntries(characteristicsMap))}, response: ${JSON.stringify(response)}`);
                    this.setState({
                        products: this.filterProducts(response.data, characteristicsMap)
                    });
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateProductsStateFromOffering(offering) {
        this.searchProducts(offering.id, null, null, null);
    }

    updateProductsStateFromFilteringParams(filteringParams) {
        this.searchProducts(null, filteringParams.selectedProductCategory?.id,
            filteringParams.text, filteringParams.selectedCharacteristicsMap);

    }

    filterProducts(products, characteristicsMap) {
        let result = products;
        if (!!characteristicsMap && characteristicsMap.size > 0) {
            result = products.filter(product => {
                const productCharacteristicsMap = new Map();
                product.characteristics.forEach(characteristic => {
                    let characteristicIds = productCharacteristicsMap.get(characteristic.groupId);
                    if (!characteristicIds) {
                        characteristicIds = [];
                    }
                    characteristicIds.push(characteristic.id);
                    productCharacteristicsMap.set(characteristic.groupId, characteristicIds);
                });
                return containsAllKeysAnyValues(productCharacteristicsMap, characteristicsMap);
            });
        }
        return result;
    }

    render() {
        return <div className="product-block">
            {this.props.dataType === 'Offering' && !!this.state.offering &&
            <div>
                <h1>{this.state.offering.name}</h1>
            </div>
            }
            {!!this.state.products && this.state.products.length > 0 &&
                <div className={`product-items ${this.props.dataType === 'Offering' ? 'main-items' : ''} 
                ${this.props.dataType === 'ProductCategory' ? 'filtered-items' : ''}`}>
                    {
                        sort(this.state.products, 'name').map(function (product) {
                            return <ProductItem key={'product-block_' + product.id} product={product}/>
                        })
                    }
                </div>
            }
            {(!this.state.products || this.state.products.length === 0) &&
                <img src={emptyStock} className="empty-stock" alt="Empty Stock"/>
            }
        </div>
    }
}
