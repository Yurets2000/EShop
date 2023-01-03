package com.yube.repositories.jpa;

import com.yube.model.entity.ProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductJpaRepository extends BaseJpaRepository<ProductEntity> {
    @Query(value = "select p from products p left join p.offerings offerings where " +
            "(?1 is null or cast(offerings.id as text) = cast(?1 as text)) " +
            "and (?2 is null or cast(p.category.id as text) = cast(?2 as text)) " +
            "and (?3 is null or upper(cast(p.name as text)) like concat('%', upper(cast(?3 as text)), '%'))")
    List<ProductEntity> search(UUID offeringId, UUID categoryId, String name, Pageable pageable);

}
