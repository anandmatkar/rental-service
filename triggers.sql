--Trigger for automatically update deleted_at in the tables where foreign key in user_id from users table

CREATE OR REPLACE FUNCTION update_deleted_at_users_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Update items table
    UPDATE items
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.id;

    -- Update item_images table
    UPDATE item_images
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.id;

    -- Add another table update statement if needed
    -- UPDATE another_table
    -- SET deleted_at = CURRENT_TIMESTAMP
    -- WHERE user_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deleted_at_users
AFTER UPDATE OF deleted_at ON users
FOR EACH ROW
EXECUTE FUNCTION update_deleted_at_users_trigger();


--Update item_images table 

CREATE OR REPLACE FUNCTION update_deleted_at_items_trigger()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE item_images
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE items_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deleted_at_items
AFTER UPDATE OF deleted_at ON items
FOR EACH ROW
EXECUTE FUNCTION update_deleted_at_items_trigger();


CREATE OR REPLACE FUNCTION update_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        UPDATE reviews
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE reviewer_id = OLD.id;

        UPDATE review_images
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE reviewer_id = OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deleted_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_deleted_at();


