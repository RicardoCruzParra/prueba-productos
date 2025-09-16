package org.evaluacion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name="productos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max=120)
    @Column(nullable=false)
    private String nombre;

    @NotNull @Positive
    @Column(nullable=false)
    private Double precio;
}