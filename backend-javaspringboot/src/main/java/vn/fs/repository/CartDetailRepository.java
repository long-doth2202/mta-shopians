package vn.fs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Cart;
import vn.fs.entity.CartDetail;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {

	List<CartDetail> findByCart(Cart cart);

	void deleteByCart(Cart cart);

}
