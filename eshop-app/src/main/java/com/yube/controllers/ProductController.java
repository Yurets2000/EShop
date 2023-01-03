package com.yube.controllers;

import com.yube.model.dto.Product;
import com.yube.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

    @GetMapping("")
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam(value = "offeringId", required = false, defaultValue = "") String offeringId,
                                @RequestParam(value = "categoryId", required = false, defaultValue = "") String categoryId,
                                @RequestParam(value = "name", required = false, defaultValue = "") String name,
                                @RequestParam("page") int page,
                                @RequestParam("pageSize") int pageSize) {
        return productService.search(offeringId, categoryId, name, page, pageSize);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable("id") String id) {
        return productService.getById(id);
    }

    @PostMapping("")
    public Product create(@RequestBody Product product) {
        return productService.create(product);
    }

    @PutMapping("")
    public Product update(@RequestBody Product product) {
        return productService.update(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        productService.delete(id);
    }
}
