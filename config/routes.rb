Foodcloud::Application.routes.draw do

  devise_for :users, :controllers => { :registrations => "users/registration", :sessions => "users/sessions" }

  devise_scope :user do
    get "users/registration/confirm" => "users/registration#confirm"
  end

  constraints(Subdomain) do
    get '/' => 'onlinesite#index'
  end

  root :to => 'administration#index'

  resources :token_authentications, :only => [:create, :destroy]

  resources :onlinesite do
    collection do
      get 'index'
      get 'preview/:id', to: "onlinesite#preview"
    end
  end

  resources :profile do
    collection do
      get 'edit'
    end
  end

  resources :website do
    collection do
      get 'index'
      post 'submit_design'
      post 'upload_image'
    end
  end

  resources :design do
    collection do
      get 'list'
      get 'fonts'
      post 'create'
      post 'update'
      post 'destroy'
      post 'destroy_image'
      post 'upload_image'
      post 'create_image'
      post 'create_font'
      post 'destroy_font'
      post 'update_font'
    end
  end  

  resources :administration do
    collection do
      get 'restaurants'
      get 'edit_menu'      
      get 'users'    
      get 'search_restaurants'
      get 'free_search_restaurants'
      get 'restaurant_setup'
      get 'search_users'
      post 'update_user'  
      post 'update_restaurant'  
      post 'destroy_user'  
      post 'publish_menu'
      post 'reset_draft_menu'
      post 'update_menu'
      post 'upload_image'        
      post 'create_user' 
      post 'user_set_restaurant'  
      post 'validate_subdomain'  
      post 'set_restaurant'  
      post 'upload_icon'
      post 'crop_image'
      post 'crop_icon'       
    end
  end

  resources :demo do
    collection do
      get 'index' 
      post 'upload_image'        
      post 'upload_icon'
      post 'crop_image'
      post 'crop_icon' 
    end
  end

  resources :menucrud do
    collection do
      post 'create_individual_option'
      post 'create_option'
      post 'create_dish'
      post 'create_section'
    end
  end  

  # match 'administration/search_restaurants', to: 'administration#search_restaurants', via: [:get]

  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      # match 'api/v1/restaurants/menu' => :menu
      resources :restaurants do
        collection do
          get 'menu'
        end
      end
      resources :restotokens, :only => [:create, :destroy]      
      resources :tokens, :only => [:create, :destroy]
      match 'tokens/create_from_facebook', to: 'tokens#create_from_facebook', via: [:post]
      resources :registration, :only => [:create]
      match 'user/add_address', to: 'user#add_address', via: [:post]
      match 'order/submit_order', to: 'order#submit_order', via: [:post]
      match 'order/confirm', to: 'order#confirm', via: [:post] 
      match 'order/status', to: 'order#status', via: [:post]  
      match 'order/fetch_orders', to: 'order#fetch_orders', via: [:post]                
    end
  end
end
