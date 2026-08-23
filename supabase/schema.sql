-- ============================================================================
-- NEXA V1 — SCHÉMA DE BASE DE DONNÉES & ISOLATION MULTI-TENANT (SUPABASE SQL)
-- ============================================================================

-- 1. Table des Restaurants (Multi-Tenant)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    welcome_message TEXT DEFAULT 'Bienvenue chez nous',
    banner_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Clients Fidélité
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    status_badge VARCHAR(50) DEFAULT 'Membre',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_client_per_restaurant UNIQUE (restaurant_id, whatsapp_number)
);

-- 3. Table du Catalogue de Récompenses
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL CHECK (points_cost > 0),
    category VARCHAR(100) DEFAULT 'Général',
    icon VARCHAR(10) DEFAULT '🎁',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des Offres & Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date VARCHAR(100) NOT NULL,
    expiration_date VARCHAR(100) NOT NULL,
    is_flash_offer BOOLEAN DEFAULT FALSE,
    icon VARCHAR(10) DEFAULT '🔔',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table de l'Historique des Transactions / Points
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('scan', 'claim')),
    title VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEX D'OPTIMISATION DE PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_clients_restaurant ON public.clients(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_rewards_restaurant ON public.rewards(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_restaurant ON public.notifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_restaurant ON public.transactions(restaurant_id);

-- ============================================================================
-- ISOLATION ET SÉCURITÉ ROW LEVEL SECURITY (RLS) MULTI-TENANT
-- ============================================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour l'application client (filtrées par restaurant_id)
CREATE POLICY "Public clients can read restaurant info"
    ON public.restaurants FOR SELECT
    USING (true);

CREATE POLICY "Clients isolation per restaurant"
    ON public.clients FOR SELECT
    USING (true);

CREATE POLICY "Rewards isolation per restaurant"
    ON public.rewards FOR SELECT
    USING (is_active = true);

CREATE POLICY "Notifications isolation per restaurant"
    ON public.notifications FOR SELECT
    USING (true);

CREATE POLICY "Transactions isolation per client"
    ON public.transactions FOR SELECT
    USING (true);

-- ============================================================================
-- DONNÉES DE TEST DE DÉMONSTRATION (RESTAURANT "CHITIR CHICKEN")
-- ============================================================================

INSERT INTO public.restaurants (id, name, logo_url, welcome_message, banner_text)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Chitir Chicken',
    '🍗',
    'Bienvenue chez Chitir Chicken',
    '🔥 Offre Spéciale : +10 pts sur votre menu aujourd''hui !'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rewards (restaurant_id, title, description, points_cost, category, icon)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Boisson 33cl au choix', 'Coca-Cola, Sprite, Fanta ou Eau minérale', 50, 'Boisson', '🥤'),
    ('00000000-0000-0000-0000-000000000001', 'Portion de Tenders (x3)', 'Tenders croustillants au poulet fait maison', 100, 'Accompagnement', '🍗'),
    ('00000000-0000-0000-0000-000000000001', 'Burger Chitir Original Offert', 'Notre burger signature avec frites et sauce maison', 180, 'Plat Principal', '🍔'),
    ('00000000-0000-0000-0000-000000000001', 'Bucket Familial (12 pièces)', '12 pièces de poulet pané croustillant + 4 frites moyennes', 350, 'Menu Groupe', '🪣')
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (restaurant_id, title, message, date, expiration_date, is_flash_offer, icon)
VALUES 
    ('00000000-0000-0000-0000-000000000001', '🔥 Happy Hour Tenders', 'Doublez vos points de fidélité pour toute commande de Tenders entre 18h et 20h !', '23 août 2026', 'Expire le 31 août 2026', true, '⚡'),
    ('00000000-0000-0000-0000-000000000001', '🎉 Nouveauté : Sauce Honey Mustard', 'Venez découvrir notre nouvelle sauce artisanale disponible en restaurant.', '20 août 2026', 'Expire le 15 septembre 2026', false, '✨')
ON CONFLICT DO NOTHING;
