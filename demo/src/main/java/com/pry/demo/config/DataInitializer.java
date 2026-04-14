package com.pry.demo.config;

import com.pry.demo.model.Categoria;
import com.pry.demo.model.Producto;
import com.pry.demo.model.Usuario;
import com.pry.demo.repository.CategoriaRepository;
import com.pry.demo.repository.ProductoRepository;
import com.pry.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- [DEBUG] INICIANDO DATA INITIALIZER ---");
        long userCount = usuarioRepository.count();
        long catCount = categoriaRepository.count();
        long prodCount = productoRepository.count();
        
        System.out.println("[DEBUG] Usuarios en BD: " + userCount);
        System.out.println("[DEBUG] Categorías en BD: " + catCount);
        System.out.println("[DEBUG] Productos en BD: " + prodCount);

        // 1. Crear Usuario Admin
        if (usuarioRepository.findByEmail("admin@gmail.com") == null) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("abcd123456"));
            admin.setEstado(1);
            admin.setFecha_registro(new Timestamp(System.currentTimeMillis()));
            admin.setMfaEnabled(false);
            usuarioRepository.save(admin);
            System.out.println(">>> [DEBUG] SEED: Usuario Admin creado.");
        }

        // 2. Asegurar Categorías
        String[] catNames = {"Hardware", "Dispositivos móviles", "Software y licencias", "Relojes inteligentes"};
        for (String name : catNames) {
            boolean exists = categoriaRepository.findAll().stream().anyMatch(c -> c.getNombre().trim().equalsIgnoreCase(name.trim()));
            if (!exists) {
                Categoria c = new Categoria();
                c.setNombre(name);
                categoriaRepository.save(c);
                System.out.println(">>> [DEBUG] SEED: Categoría '" + name + "' creada.");
            }
        }

        // 3. Crear Productos (Forzar si hay pocos)
        if (prodCount < 8) {
            System.out.println(">>> [DEBUG] SEED: Catálogo insuficiente (" + prodCount + "). Generando productos premium...");
            
            Integer hardwareId = findId("Hardware");
            Integer mobileId = findId("Dispositivos móviles");
            Integer softwareId = findId("Software y licencias");
            Integer watchId = findId("Relojes inteligentes");

            productoRepository.saveAll(Arrays.asList(
                createProducto("MacBook Pro M3 Max", "Laptop de alto rendimiento para profesionales creativos.", 3499.00, 15, hardwareId, "https://images.unsplash.com/photo-1517336714460-4c502117aff0?q=80&w=600"),
                createProducto("iPhone 15 Pro Titanium", "El chip A17 Pro más potente en un diseño de titanio ligero.", 1199.00, 40, mobileId, "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=600"),
                createProducto("Windows 11 Professional", "Licencia OEM original con soporte de por vida.", 149.99, 100, softwareId, "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600"),
                createProducto("Apple Watch Ultra 2", "Reloj deportivo de aventura con GPS de precisión doble banda.", 799.00, 25, watchId, "https://images.unsplash.com/photo-1434493907317-a46b53b81882?q=80&w=600"),
                createProducto("Dell XPS 15 OLED", "Pantalla 4K InfinityEdge con gráficos NVIDIA RTX.", 2199.00, 10, hardwareId, "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600"),
                createProducto("Samsung Galaxy S24 Ultra", "Inteligencia Artificial integrada con pantalla de 2600 nits.", 1299.00, 30, mobileId, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600"),
                createProducto("Adobe Creative Cloud 1 Year", "Suscripción anual a todas las apps de Adobe.", 599.00, 50, softwareId, "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600"),
                createProducto("Garmin Epix Gen 2", "Reloj multideporte con pantalla AMOLED y mapas topográficos.", 899.00, 12, watchId, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600")
            ));
            System.out.println(">>> [DEBUG] SEED: Catálogo inicializado con 8 productos.");
        }
        System.out.println("--- [DEBUG] DATA INITIALIZER FINALIZADO ---");
    }


    private Integer findId(String nombre) {
        return categoriaRepository.findAll().stream()
                .filter(c -> c.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .map(c -> c.getId_categoria().intValue())
                .orElse(1);
    }

    private Producto createProducto(String nombre, String desc, double precio, int stock, int catId, String img) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(desc);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setId_categoria(catId);
        p.setImagen_url(img);
        p.setEstado(1);
        return p;
    }
}
