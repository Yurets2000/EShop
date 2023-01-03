import './categories.component.css';
import {Component} from 'react';
import ProductCategoriesService from '../../services/product-category.service';
import ProductBlock from '../product-block/product-block.component';
import {buildUrl, getParameterByName} from '../../utils/url-utils';
import {sort} from '../../utils/list-utils';

export default class Categories extends Component {

    constructor(props) {
        super(props);
        this.buildCategoriesUrl = this.buildCategoriesUrl.bind(this);
        this.retrieveText = this.retrieveText.bind(this);
        this.retrieveProductCategories = this.retrieveProductCategories.bind(this);
        this.retrieveSelectedProductCategory = this.retrieveSelectedProductCategory.bind(this);
        this.onCharacteristicCheckboxClick = this.onCharacteristicCheckboxClick.bind(this);

        this.state = {
            productCategories: [],
            filteringParams: {
                text: null,
                selectedProductCategory: null,
                selectedCharacteristicsMap: new Map()
            }
        }
    }

    componentDidMount() {
        this.retrieveProductCategories();
        this.retrieveText();
        this.retrieveSelectedProductCategory();
    }

    retrieveText() {
        this.setState({
            filteringParams: {
                ...this.state.filteringParams,
                text: getParameterByName('text')
            }
        });
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

    retrieveSelectedProductCategory() {
        const text = getParameterByName('text');
        const categoryId = getParameterByName('category');
        if (!!categoryId) {
            ProductCategoriesService.getById(categoryId)
                .then(response => {
                    this.setState({
                        filteringParams: {
                            ...this.state.filteringParams,
                            selectedProductCategory: response.data
                        }
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            if (!text) {
                ProductCategoriesService.getDefault()
                    .then(response => {
                        this.setState({
                            filteringParams: {
                                ...this.state.filteringParams,
                                selectedProductCategory: response.data
                            }
                        });
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    }

    onCharacteristicCheckboxClick(e, characteristicGroupId, characteristicId) {
        let selectedCharacteristicsMap = new Map(this.state.filteringParams.selectedCharacteristicsMap);
        let characteristicIds = selectedCharacteristicsMap.get(characteristicGroupId);
        if (!characteristicIds) {
            characteristicIds = [];
        }

        if (e.target.checked) {
            characteristicIds.push(characteristicId);
        } else {
            const characteristicIndex = characteristicIds.indexOf(characteristicId);
            if (characteristicIndex !== -1) {
                characteristicIds.splice(characteristicIndex, 1);
            }
        }
        if (characteristicIds.length === 0) {
            selectedCharacteristicsMap.delete(characteristicGroupId);
        } else {
            selectedCharacteristicsMap.set(characteristicGroupId, characteristicIds);
        }
        this.setState({
            filteringParams: {
                ...this.state.filteringParams,
                selectedCharacteristicsMap: selectedCharacteristicsMap
            }
        })
    }

    buildCategoriesUrl(categoryId) {
        const queryParameters = new Map();
        queryParameters.set('text', getParameterByName('text'));
        queryParameters.set('category', categoryId);
        return buildUrl('./categories', queryParameters);
    }

    render() {
        const productCategories = this.state.productCategories;
        const filteringParams = this.state.filteringParams;
        const text = filteringParams.text;
        const selectedProductCategory = filteringParams.selectedProductCategory;
        const selectedCharacteristicsMap = filteringParams.selectedCharacteristicsMap;
        const onCharacteristicCheckboxClick = (e, characteristicGroupId, characteristicId) => {
            this.onCharacteristicCheckboxClick(e, characteristicGroupId, characteristicId);
        }
        const buildCategoriesUrl = (categoryId) => {
            return this.buildCategoriesUrl(categoryId);
        }

        return <div className="categories">
            {productCategories &&
            <div className="filtering-block">
                <div className="categories-block">
                    <h3 className="categories-head">Categories</h3>
                    <ul className="product-categories">
                        {
                            sort(productCategories, 'name').map(function (productCategory) {
                                return <li
                                    key={'categories_' + productCategory.id}
                                    className={`${!!selectedProductCategory && productCategory.id === selectedProductCategory.id ? 'selected-item' : ''}`}>
                                    <a href={buildCategoriesUrl(productCategory.id)}>{productCategory.name}</a>
                                </li>
                            })
                        }
                    </ul>
                </div>
                {selectedProductCategory &&
                    <div className="filters-block">
                        <h3 className="filters-head">Filters</h3>
                        <ul className="filters-categories">
                            {
                                sort(selectedProductCategory.characteristicGroups, 'name').map(function (characteristicGroup) {
                                    return <div key={'characteristic_group_' + characteristicGroup.id}
                                                className="filter-category">
                                        <h4 className="filter-category-head">{characteristicGroup.name}</h4>
                                        <ul className="filter-subcategories">
                                            {
                                                sort(characteristicGroup.characteristics, 'name').map(function (characteristic) {
                                                    return <li key={'characteristic_' + characteristic.id}>
                                                        <input type="checkbox" id={characteristic.id}
                                                               name={characteristicGroup.name} value={characteristic.id}
                                                               checked={!!selectedCharacteristicsMap.get(characteristicGroup.id) &&
                                                               selectedCharacteristicsMap.get(characteristicGroup.id).indexOf(characteristic.id) !== -1}
                                                               onChange={e => onCharacteristicCheckboxClick(e, characteristicGroup.id, characteristic.id)}/>
                                                        <label
                                                            htmlFor={characteristic.id}>{characteristic.value}</label>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                })
                            }
                        </ul>
                    </div>
                }
            </div>
            }
            {productCategories && (!!selectedProductCategory || !!text) &&
            <ProductBlock data={{filteringParams: filteringParams}} dataType={'ProductCategory'}/>
            }
        </div>
    }
}
