package vn.fs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.fs.entity.OrderDetail;
import vn.fs.entity.Product;
import vn.fs.entity.Rate;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {

	List<Rate> findAllByOrderByIdDesc();

	Rate findByOrderDetail(OrderDetail orderDetail);

	List<Rate> findByProductOrderByIdDesc(Product product);

}
