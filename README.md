# EA Filter Category

Small WordPress plugin for WooCommerce. It adds one live text filter to the product category metabox on the product create/edit screen.

It only runs in `wp-admin`, only on the `product` edit screen, and it does not change saving, category data, or the storefront.

## Files

```text
ea-filter-category/
├── assets/
│   ├── css/
│   │   └── admin.css
│   └── js/
│       └── admin.js
├── docker-compose.yml
├── ea-filter-category.php
├── .gitignore
└── README.md
```

## Local test in Codespaces

Dependencies: Docker and Docker Compose. No Composer, Node, build step, or WordPress package dependency is required.

1. Open the repository folder.
2. Start WordPress:

```bash
docker compose up -d
```

3. Open:

```text
http://localhost:8080
```

4. Complete the WordPress installer.
5. Go to `Plugins > Add New`, search for `WooCommerce`, install and activate it.
6. Go to `Plugins > Installed Plugins` and activate `EA Filter Category`.
7. Create test categories in `Products > Categories`, for example:

```text
Zapatos
Zapatos deportivos
Camisetas
Accesorios
```

8. Go to `Products > Add New`.
9. In the `Product categories` box, type `zap` in the new input.
10. Confirm that only matching product categories stay visible.
11. Save a product with a selected category and confirm it saves normally.

## Package ZIP

From the parent folder of `ea-filter-category`, run:

```bash
zip -r ea-filter-category.zip ea-filter-category -x "ea-filter-category/.git/*" "ea-filter-category/*.zip"
```

If you are on Windows PowerShell inside the plugin folder:

```powershell
Compress-Archive -Path .\* -DestinationPath ..\ea-filter-category.zip -Force
```

## Install tomorrow

Option A, through WordPress admin:

1. Go to `Plugins > Add New > Upload Plugin`.
2. Upload `ea-filter-category.zip`.
3. Activate `EA Filter Category`.
4. Open `Products > Add New` or edit an existing product.
5. Test the product category filter with part of a category name.

Option B, through the office repository:

1. Copy the full `ea-filter-category` folder into the WordPress plugins directory:

```text
wp-content/plugins/ea-filter-category
```

2. Commit it in the office repo.
3. Activate the plugin from `Plugins > Installed Plugins`.
4. Test only in a WooCommerce product edit screen.

## Technical notes

- WordPress renders hierarchical taxonomy metaboxes with `post_categories_meta_box()`.
- WooCommerce product categories use the taxonomy slug `product_cat`.
- This plugin targets the existing admin markup: `#taxonomy-product_cat`, `#product_catchecklist`, and `#product_catchecklist-pop`.
- Assets are enqueued with `admin_enqueue_scripts` only when the current screen is the `product` post edit screen.
