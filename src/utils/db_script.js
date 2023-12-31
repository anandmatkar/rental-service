const db_sql = {
    Q1: `SELECT * FROM users WHERE email = '{var1}' AND deleted_at IS NULL`,
    Q2: `INSERT INTO users(first_name,last_name, email, password,phone,avatar,otp) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}', '{var6}', '{var7}') RETURNING *`,
    Q3: `INSERT INTO address( address, city, pincode, state, user_id) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}') RETURNING *`,
    Q4: `UPDATE users SET is_verified = '{var1}', updated_at = '{var2}', otp = '{var3}' WHERE email = '{var4}' AND deleted_at IS NULL RETURNING *`,
    Q5: `SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.password,
            u.phone,
            u.avatar,
            u.user_type,
            u.is_active,
            u.is_verified,
            u.created_at,
            u.updated_at,
            u.deleted_at,
            json_agg(a.*) AS addresses
        FROM
            users u
        LEFT JOIN
            address a ON u.id = a.user_id
        WHERE
            u.id = '{var1}'
            AND u.deleted_at IS NULL
            ANd a.deleted_at IS NULL
        GROUP BY
            u.id;`,
    Q6: `SELECT id,first_name,last_name,email,password,phone,avatar,user_type,is_active,is_verified,created_at,updated_at,deleted_at FROM users WHERE id = '{var1}' AND is_active = false AND deleted_at IS NULL `,
    Q7: `UPDATE users SET deleted_at = '{var1}' WHERE id = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q8: `UPDATE users
            SET first_name = '{var1}',
                last_name = '{var2}',
                avatar = '{var3}',
                email = '{var4}'
            WHERE id = '{var5}'
                AND deleted_at IS NULL RETURNING *;`,
    Q9: `UPDATE address
            SET address = '{var1}',
                city = '{var2}',
                pincode = '{var3}',
                state = '{var4}'
            WHERE user_id = '{var5}'
                AND deleted_at IS NULL RETURNING *;`,
    Q10: `UPDATE users SET password = '{var1}', otp = '{var2}' WHERE {var3} = '{var4}' AND deleted_at IS NULL RETURNING *`,
    Q11: `UPDATE users SET otp = '{var1}' WHERE email = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q12: `SELECT * FROM super_admin WHERE email = '{var1}' AND deleted_at IS NULL`,
    Q13: `SELECT id,name,email,password,avatar FROM super_admin WHERE id = '{var1}' AND deleted_at IS NULL`,
    Q14: `UPDATE super_admin SET password = '{var1}', updated_at = '{var2}' WHERE id = '{var3}' AND deleted_at IS NULL RETURNING *`,
    Q15: `UPDATE super_admin SET otp = '{var1}' WHERE email = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q16: `UPDATE super_admin SET password = '{var1}', otp = '{var2}' WHERE {var3} = '{var4}' AND deleted_at IS NULL RETURNING *`,
    Q17: `SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.password,
                u.phone,
                u.avatar,
                u.user_type,
                u.is_active,
                u.is_verified,
                u.created_at,
                u.updated_at,
                u.deleted_at,
                json_agg(a.*) AS addresses
            FROM
                users u
            LEFT JOIN
                address a ON u.id = a.user_id
            WHERE
                u.deleted_at IS NULL
                ANd a.deleted_at IS NULL
            GROUP BY
                u.id;`,
    Q18: `INSERT INTO category (category_name,description,image,created_by) VALUES('{var1}','{var2}','{var3}','{var4}') RETURNING *`,
    Q19: `SELECT * FROM category WHERE category_name = '{var1}' AND deleted_at IS NULL`,
    Q20: `SELECT 
            category.id AS "id",
            category.category_name AS "category_name",
            category.description AS "description",
            category.image AS "image",
            json_agg(sub_category.name) AS "subcategories"
        FROM
            category
        LEFT JOIN
            sub_category ON category.id = sub_category.category_id
        WHERE
            category.deleted_at IS NULL
        GROUP BY
            category.id, category.category_name, category.description, category.image;`,
    Q21: `SELECT * FROM category WHERE id = '{var1}' AND deleted_at IS NULL`,
    Q22: `UPDATE category SET deleted_at = '{var1}' WHERE id = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q23: `UPDATE users SET is_active = '{var1}', updated_at = '{var2}' WHERE id = '{var3}' AND deleted_at IS NULL RETURNING *`,
    Q24: `INSERT INTO items(category_id,user_id,item_name,description,deposit_price,rental_price,availability_status, category, image, unit) VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}','{var7}','{var8}', '{var9}', '{var10}') RETURNING *`,
    Q25: `SELECT
                items.*,
                COALESCE(json_agg(item_images.*) FILTER(WHERE item_images.id IS NOT NULL), '[]'::json) AS item_images,
                COALESCE(AVG(reviews.rating), 0) AS average_rating
            FROM
                items
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                item_images ON items.id = item_images.items_id
            LEFT JOIN
                reviews ON items.id = reviews.item_id
            WHERE
                users.is_active = true
                AND users.deleted_at IS NULL
                AND items.deleted_at IS NULL
                AND item_images.deleted_at IS NULL
            GROUP BY
                items.id
            ORDER BY
                items.availability_status DESC;`,
    Q26: `SELECT
                items.*,
                category.category_name,
                COALESCE(json_agg(item_images.*) FILTER(WHERE item_images.id IS NOT NULL), '[]'::json) AS item_images
            FROM
                items
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                item_images ON items.id = item_images.items_id
            LEFT JOIN
            category ON items.category_id = category.id
            WHERE
                users.is_active = true
                AND items.id = '{var1}'
                AND users.deleted_at IS NULL
                AND items.deleted_at IS NULL
                AND item_images.deleted_at IS NULL
                AND category.deleted_at IS NULL
            GROUP BY
                items.id, category.category_name;`,
    Q27: `UPDATE items SET item_name = '{var1}', description = '{var2}', deposit_price = '{var3}',rental_price = '{var4}', category = '{var5}', category_id = '{var6}', unit = '{var7}' WHERE id = '{var8}' AND deleted_at IS NULL RETURNING *`,
    Q28: `SELECT * FROM users WHERE id = '{var1}' AND deleted_at IS NULL`,
    Q29: `SELECT
                items.*,
                COALESCE(json_agg(item_images.*) FILTER(WHERE item_images.id IS NOT NULL), '[]'::json) AS item_images
            FROM
                items
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                item_images ON items.id = item_images.items_id
            WHERE
                items.user_id = '{var1}'
                AND users.is_active = true
                AND users.deleted_at IS NULL
                AND items.deleted_at IS NULL
                AND item_images.deleted_at IS NULL
            GROUP BY
                items.id
            ORDER BY
                items.availability_status DESC;`,
    Q30: `INSERT INTO rental_items(items_id,item_name ,item_description,category_name ,deposit_price ,rental_price ,total_price ,   renter_id ,receiver_id ,renter_name ,renter_email ,reveiver_name ,reveiver_email ,start_date ,end_date  ,status,approval_otp) VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}','{var7}','{var8}','{var9}','{var10}','{var11}','{var12}','{var13}','{var14}','{var15}','{var16}','{var17}') RETURNING *`,
    Q31: `SELECT id, first_name, last_name, email, phone
    FROM users
    WHERE id IN ('{var1}', '{var2}')
      AND deleted_at IS NULL
    ORDER BY id = '{var1}' DESC, id = '{var2}' DESC;`,
    Q32: `SELECT * FROM rental_items WHERE renter_id = '{var1}' AND status = '{var2}' AND deleted_at IS NULL`,
    Q33: `UPDATE rental_items SET status = '{var1}', approval_otp = '{var2}' WHERE id = '{var3}' AND deleted_at IS NULL RETURNING * `,
    Q34: `UPDATE rental_items SET status = '{var1}', approval_otp = '{var2}' WHERE id = '{var3}' AND deleted_at IS NULL`,
    Q35: `SELECT * FROM rental_items WHERE id = '{var1}' AND status = '{var2}' AND deleted_at IS NULL`,
    Q36: `UPDATE items SET availability_status = '{var1}' WHERE id = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q37: `SELECT
                items.*,
                COALESCE(json_agg(item_images.*) FILTER (WHERE item_images.id IS NOT NULL), '[]'::json) AS images,
                COALESCE(AVG(reviews.rating), 0) AS average_rating
            FROM
                items
            LEFT JOIN
                item_images ON items.id = item_images.items_id
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                reviews ON items.id = reviews.item_id
            WHERE
                (items.item_name ILIKE '%{var1}%' OR
                items.description ILIKE '%{var1}%' OR
                items.category ILIKE '%{var1}%')
                AND users.is_active = true
                AND users.deleted_at IS NULL
                AND items.deleted_at IS NULL
                AND item_images.deleted_at IS NULL
            GROUP BY
                items.id
            HAVING
                COALESCE(AVG(reviews.rating), 0) >= '{var2}' AND COALESCE(AVG(reviews.rating), 0) <= '{var3}'
                AND items.rental_price >= '{var4}' AND items.rental_price <= '{var5}';`,
    Q38: `SELECT
                items.*,
                COALESCE(json_agg(item_images.*) FILTER (WHERE item_images.id IS NOT NULL), '[]'::json) AS images,
                COALESCE(AVG(reviews.rating), 0) AS average_rating
            FROM
                items
            LEFT JOIN
                item_images ON items.id = item_images.items_id
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                reviews ON items.id = reviews.item_id
            WHERE
                items.category ILIKE '%{var1}%'
                AND users.is_active = true
                AND users.deleted_at IS NULL
                AND items.deleted_at IS NULL
                AND item_images.deleted_at IS NULL
            GROUP BY
                items.id
            HAVING
                COALESCE(AVG(reviews.rating), 0) >= '{var2}' AND COALESCE(AVG(reviews.rating), 0) <= '{var3}'
                AND items.rental_price >= '{var4}' AND items.rental_price <= '{var5}';`,
    Q39: `INSERT INTO reviews(item_id,reviewer_id,rating,comments) VALUES('{var1}','{var2}','{var3}','{var4}') RETURNING *`,
    Q40: `INSERT INTO review_images(review_id, item_id,reviewer_id,path) VALUES('{var1}','{var2}','{var3}','{var4}') RETURNING *`,
    Q41: `SELECT * FROM items WHERE user_id = '{var1}' AND deleted_at IS NULL`,
    Q42: `SELECT * FROM rental_items WHERE receiver_id = '{var1}' AND deleted_at IS NULL`,
    Q43: `SELECT
                reviews.*,
                COALESCE(json_agg(review_images.*), '[]'::json) AS review_images
            FROM
                reviews
            LEFT JOIN
                review_images ON reviews.id = review_images.review_id
            WHERE
                reviews.item_id = '{var1}'
                AND reviews.deleted_at IS NULL
            GROUP BY
                reviews.id;`,
    Q44: `UPDATE reviews SET rating = '{var1}', comments = '{var2}' WHERE id = '{var3}' AND reviewer_id = '{var4}' AND deleted_at IS NULL RETURNING *`,
    Q45: `UPDATE reviews SET deleted_at = '{var1}' WHERE id = '{var2}' AND reviewer_id = '{var3}' AND deleted_at IS NULL RETURNING *`,
    Q46: `SELECT reviews.*,
          COALESCE(json_agg(review_images.*), '[]'::json) AS review_images
          FROM
                reviews
            LEFT JOIN
                review_images ON reviews.id = review_images.review_id
            WHERE
                reviews.reviewer_id = '{var1}'
                AND reviews.deleted_at IS NULL
            GROUP BY
                reviews.id;`,
    Q47: `INSERT INTO messages(message_content,sender_id,receiver_id) VALUES('{var1}', '{var2}', '{var3}') RETURNING *`,
    Q48: `SELECT * FROM messages WHERE sender_id = '{var1}' AND receiver_id = '{var2}' OR sender_id = '{var2}' AND receiver_id = '{var1}' AND deleted_at IS NULL`,
    Q49: `DELETE FROM messages WHERE id = '{var1}' AND deleted_at IS NULL RETURNING *`,
    Q50: `INSERT INTO item_images(user_id, items_id, path) VALUES('{var1}','{var2}', '{var3}') RETURNING *`,
    Q51: `INSERT INTO notifications(user_id, message) VALUES('{var1}', '{var2}') RETURNING *`,
    Q52: `SELECT * FROM notifications WHERE user_id = '{var1}' AND deleted_at IS NULL AND read = '{var2}'`,
    Q53: `UPDATE notifications SET read = '{var1}' WHERE user_id = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q54: `UPDATE notifications SET read = '{var1}' WHERE user_id = '{var2}' AND id = '{var3}' AND deleted_at IS NULL RETURNING *`




};

function dbScript(template, variables) {
    if (variables != null && Object.keys(variables).length > 0) {
        template = template.replace(new RegExp("\{([^\{]+)\}", "g"), (_unused, varName) => {
            return variables[varName];
        });
    }
    template = template.replace(/'null'/g, null);
    return template
}

module.exports = { db_sql, dbScript };
