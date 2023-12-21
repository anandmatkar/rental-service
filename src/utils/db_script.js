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
                avatar = '{var3}'
            WHERE id = '{var4}'
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
    Q20: `SELECT * FROM category WHERE deleted_at IS NULL`,
    Q21: `SELECT * FROM category WHERE id = '{var1}' AND deleted_at IS NULL`,
    Q22: `UPDATE category SET deleted_at = '{var1}' WHERE id = '{var2}' AND deleted_at IS NULL RETURNING *`,
    Q23: `UPDATE users SET is_active = '{var1}', updated_at = '{var2}' WHERE id = '{var3}' AND deleted_at IS NULL RETURNING *`,
    Q24: `INSERT INTO items(category_id,user_id,item_name,description,deposit_price,rental_price,availability_status) VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}','{var7}') RETURNING *`,
    Q25: `SELECT
                items.*,
                COALESCE(json_agg(item_images.*) FILTER(WHERE item_images.id IS NOT NULL), '[]'::json) AS item_images
            FROM
                items
            JOIN
                users ON items.user_id = users.id
            LEFT JOIN
                item_images ON items.id = item_images.items_id
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
    Q27: `UPDATE items SET item_name = '{var1}', description = '{var2}', deposit_price = '{var3}',rental_price = '{var4}',availability_status = '{var5}' WHERE id = '{var6}' AND deleted_at IS NULL RETURNING *`,
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
