package com.demo.ecommerce.dao;

import com.demo.ecommerce.entity.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long>
{
	Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
	Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
}
