package org.evaluacion.service;

import org.evaluacion.model.Producto;
import org.evaluacion.repo.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository repo;

    public List<Producto> listar(){
        return repo.findAll();
    }

    public Producto crear(Producto p){
        p.setId(null);
        return repo.save(p);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    public Producto actualizar(Long id, Producto p){
        return repo.findById(id).map(x -> {
            x.setNombre(p.getNombre()); x.setPrecio(p.getPrecio());
            return repo.save(x);
        }).orElseThrow(() -> new IllegalArgumentException("No existe producto"));
    }
}