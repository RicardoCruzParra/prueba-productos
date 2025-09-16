package org.evaluacion.controller;

import org.evaluacion.model.Producto;
import org.evaluacion.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService service;

    @GetMapping public List<Producto> listar(){
        return service.listar();
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto p){
        return service.crear(p);
    }

    @PutMapping("/{id}") public Producto actualizar(@PathVariable Long id, @Valid @RequestBody Producto p){
        return service.actualizar(id, p);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id){
        service.eliminar(id);
    }
}