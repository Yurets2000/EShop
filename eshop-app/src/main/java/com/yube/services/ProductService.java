package com.yube.services;

import com.yube.model.dto.Product;
import com.yube.model.entity.OfferingEntity;
import com.yube.model.entity.ProductCategoryEntity;
import com.yube.model.entity.ProductEntity;
import com.yube.model.mapping.ProductMapper;
import com.yube.model.mapping.utils.MappingUtils;
import com.yube.repositories.declaration.OfferingRepository;
import com.yube.repositories.declaration.ProductCategoryRepository;
import com.yube.repositories.declaration.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final OfferingRepository offeringRepository;

    public List<Product> getAll() {
        return MappingUtils.mapAll(productRepository.getAll(), productMapper::map);
    }

    public List<Product> search(String offeringId, String categoryId, String name, int page, int pageSize) {
        if (page < 0) page = 0;
        if (pageSize <= 0) pageSize = 20;
        return MappingUtils.mapAll(productRepository.search(
                StringUtils.isEmpty(offeringId) ? null : UUID.fromString(offeringId),
                StringUtils.isEmpty(categoryId) ? null : UUID.fromString(categoryId),
                StringUtils.isEmpty(name) ? null : name,
                page, pageSize), productMapper::map);
    }

    public Product getById(String id) {
        return productMapper.map(productRepository.get(UUID.fromString(id)).get());
    }

    public Product create(Product product) {
        ProductEntity productEntity = productMapper.unmap(product);
        String categoryId = product.getCategoryId();
        if (categoryId != null) {
            ProductCategoryEntity productCategoryEntity = productCategoryRepository.get(UUID.fromString(categoryId)).get();
            productEntity.setCategory(productCategoryEntity);
        }
        List<String> offeringIds = product.getOfferingIds();
        if (offeringIds != null) {
            Set<String> uniqueOfferingIds = new HashSet<>(offeringIds);
            Set<OfferingEntity> offeringEntities = new HashSet<>();
            uniqueOfferingIds.forEach(offeringId -> {
                offeringEntities.add(offeringRepository.get(UUID.fromString(offeringId)).get());
            });
            productEntity.setOfferings(offeringEntities);
        }
        ProductEntity resultEntity = productRepository.create(productEntity);
        return productMapper.map(resultEntity);
    }

    public Product update(Product product) {
        ProductEntity sourceProductEntity = productMapper.unmap(product);
        ProductEntity targetProductEntity = productRepository.get(sourceProductEntity.getId()).get();
        BeanUtils.copyProperties(sourceProductEntity, targetProductEntity, "category", "offerings");
        ProductEntity updatedProductEntity = productRepository.update(targetProductEntity);
        return productMapper.map(updatedProductEntity);
    }

    public void delete(String id) {
        productRepository.delete(UUID.fromString(id));
    }
}
