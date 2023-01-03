package com.yube.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@ToString(exclude = {"characteristicGroups"}, callSuper = true)
@EqualsAndHashCode(exclude = {"characteristicGroups"}, callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductCategory extends ObjectBase {
    private List<CharacteristicGroup> characteristicGroups;
}
