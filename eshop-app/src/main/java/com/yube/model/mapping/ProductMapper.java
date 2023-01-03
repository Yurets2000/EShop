package com.yube.model.mapping;

import com.yube.model.dto.Product;
import com.yube.model.entity.BaseEntity;
import com.yube.model.entity.OfferingEntity;
import com.yube.model.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(uses = {StringToIdMapper.class, CharacteristicMapper.class}, componentModel = "spring")
public abstract class ProductMapper implements BaseMapper<ProductEntity, Product> {

    @Override
    @Mappings({
            @Mapping(source = "category.id", target = "categoryId"),
            @Mapping(source = "offerings", target = "offeringIds", qualifiedByName = "mapOfferingEntities")
    })
    public abstract Product map(ProductEntity source);

    @Override
    @Mappings({
            @Mapping(source = "categoryId", target = "category.id"),
            @Mapping(source = "offeringIds", target = "offerings", qualifiedByName = "unmapOfferingIds")
    })
    public abstract ProductEntity unmap(Product source);

    @Named("mapOfferingEntities")
    public List<String> mapOfferingEntities(Set<OfferingEntity> offeringEntities) {
        if (offeringEntities == null) return null;
        return offeringEntities.stream()
                .map(BaseEntity::getId)
                .map(UUID::toString)
                .collect(Collectors.toList());
    }

    @Named("unmapOfferingIds")
    public Set<OfferingEntity> unmapOfferingIds(List<String> offeringIds) {
        if (offeringIds == null) return null;
        return offeringIds.stream()
                .map(offeringId -> {
                    OfferingEntity offeringEntity = new OfferingEntity();
                    offeringEntity.setId(UUID.fromString(offeringId));
                    return offeringEntity;
                })
                .collect(Collectors.toSet());
    }
}
