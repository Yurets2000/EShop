import './wish-list.component.css';
import '../../assets/css/main.css';
import React, {Component} from 'react';
import ProductItem from '../product-item/product-item.component';
import {sort} from '../../utils/list-utils';
import emptyStock from '../../assets/img/empty-stock.png';
import {connect} from 'react-redux';

class WishList extends Component {

    render() {
        const wishList = this.props.user.wishlist;

        return <div>
            <h1 className="main-header">Wish List</h1>
            <div className="product-block">
                {!!wishList && wishList.length > 0 &&
                <div className="product-items">
                    {
                        sort(wishList, 'name').map(function (product) {
                            return <ProductItem key={'product-block_' + product.id} product={product}/>
                        })
                    }
                </div>
                }
                {(!wishList || wishList.length === 0) &&
                <img src={emptyStock} className="empty-stock" alt="Empty Stock"/>
                }
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    const user = state.user;
    return {
        user
    };
}

export default connect(mapStateToProps)(WishList);