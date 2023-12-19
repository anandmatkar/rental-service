CREATE OR REPLACE FUNCTION update_items_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deleted_at IS NOT NULL THEN
    UPDATE items
    SET deleted_at = NEW.deleted_at
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_items_deleted_at
AFTER UPDATE OF deleted_at ON users
FOR EACH ROW
EXECUTE FUNCTION update_items_deleted_at();


CREATE OR REPLACE FUNCTION update_item_images_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deleted_at IS NOT NULL THEN
    UPDATE item_images
    SET deleted_at = NEW.deleted_at
    WHERE items_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_item_images_deleted_at
AFTER UPDATE OF deleted_at ON items
FOR EACH ROW
EXECUTE FUNCTION update_item_images_deleted_at();
