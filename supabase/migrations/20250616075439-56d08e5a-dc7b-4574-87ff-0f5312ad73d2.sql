
-- Create categories table for cake/cupcake types (skip if exists)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create products table for cakes and cupcakes (skip if exists)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create orders table (skip if exists)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create order_items table (skip if exists)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop if exists first)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;
CREATE POLICY "Users can create their own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample categories (only if they don't exist)
INSERT INTO public.categories (name, description) 
SELECT 'Cakes', 'Delicious cakes for all occasions'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Cakes');

INSERT INTO public.categories (name, description) 
SELECT 'Cupcakes', 'Individual sweet treats perfect for any time'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Cupcakes');

INSERT INTO public.categories (name, description) 
SELECT 'Brownies', 'Rich, fudgy brownies that melt in your mouth'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Brownies');

-- Insert sample products (only if they don't exist)
INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Chocolate Fudge Cake', 'Rich chocolate cake with fudge frosting', 25.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Chocolate Fudge Cake');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Vanilla Dream Cake', 'Classic vanilla cake with buttercream', 22.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Vanilla Dream Cake');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Red Velvet Cake', 'Traditional red velvet with cream cheese frosting', 28.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Red Velvet Cake');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Chocolate Cupcakes', 'Rich chocolate cupcakes (pack of 6)', 12.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cupcakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Chocolate Cupcakes');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Vanilla Cupcakes', 'Classic vanilla cupcakes (pack of 6)', 10.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cupcakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Vanilla Cupcakes');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Strawberry Cupcakes', 'Fresh strawberry cupcakes (pack of 6)', 13.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Cupcakes' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Strawberry Cupcakes');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Double Chocolate Brownies', 'Rich fudgy brownies (pack of 4)', 8.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Brownies' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Double Chocolate Brownies');

INSERT INTO public.products (name, description, price, category_id, image_url)
SELECT 'Walnut Brownies', 'Brownies with crunchy walnuts (pack of 4)', 9.99, c.id, '/placeholder.svg'
FROM public.categories c
WHERE c.name = 'Brownies' AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Walnut Brownies');
