package com.yube.repositories.declaration;

import com.yube.model.entity.ProductEntity;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends BaseRepository<ProductEntity> {
    List<ProductEntity> search(UUID offeringId, UUID categoryId, String name, int page, int pageSize);
}
