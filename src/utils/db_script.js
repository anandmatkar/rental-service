const db_sql = {
    Q1: `SELECT * FROM users WHERE email = '{var1}' AND deleted_at IS NULL`,
    Q2: `INSERT INTO users(first_name,last_name, email, password,phone,avatar,user_type,otp) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}', '{var6}', '{var7}', '{var8}') RETURNING *`,
    Q3: `INSERT INTO address( address, city, pincode, state, user_id) VALUES('{var1}', '{var2}', '{var3}','{var4}', '{var5}') RETURNING *`,
    Q4: `UPDATE users SET is_verified = '{var1}', updated_at = '{var2}', otp = '{var3}' WHERE email = '{var4}' AND deleted_at IS NULL RETURNING *`,
    Q5: `SELECT id,first_name,last_name,email,password,phone,avatar,user_type,is_active,is_verified,created_at,updated_at,deleted_at FROM users WHERE id = '{var1}' AND deleted_at IS NULL `,
    Q6: `SELECT id,first_name,last_name,email,password,phone,avatar,user_type,is_active,is_verified,created_at,updated_at,deleted_at FROM users WHERE id = '{var1}' AND is_active = false AND deleted_at IS NULL `,
    Q7: `UPDATE users SET deleted_at = '{var1}' WHERE id = '{var2}' AND deleted_at IS NULL RETURNING *`
};

function dbScript(template, variables) {
    if (variables != null && Object.keys(variables).length > 0) {
        template = template.replace(
            new RegExp("{([^{]+)}", "g"),
            (_unused, varName) => {
                return variables[varName];
            }
        );
    }
    template = template.replace(/'null'/g, null);
    return template;
}

module.exports = { db_sql, dbScript };
