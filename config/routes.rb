Foodcloud::Application.routes.draw do

  devise_for :users, :controllers => { :registrations => "users/registration", :sessions => "users/sessions" }

  devise_scope :user do
    get "users/registration/confirm" => "users/registration#confirm"
  end

  constraints(Letsdishgo) do
    get '/' => 'letsdishgo#index'
  end

  constraints(Subdomain) do
    get '/' => 'onlinesite#index'
    get '/robots.txt' => 'robots#index'
    get '/sitemap.xml' => 'robots#sitemap'
  end

  if Rails.env.production?
     get '404', :to => 'application#page_not_found'
     get '422', :to => 'application#server_error'
     get '500', :to => 'application#server_error'
  end  

  root :to => 'administration#index'

  resources :token_authentications, :only => [:create, :destroy]

  resources :facebook do
    collection do
      post '/', to: "facebook#index"
      get '/', to: "facebook#index"
      post 'fb_sign_in', to: "facebook#fb_sign_in"
      post 'setup_page', to: "facebook#setup_page"
      post 'setup', to: "facebook#setup"
      get 'setup', to: "facebook#setup"
    end
  end

  resources :prizes do
    collection do
      get '/', to: "prizes#index"
      post '/destroy', to: "prizes#destroy"
      post '/create', to: "prizes#create"
      post '/save', to: "prizes#save"
      get '/list', to: "prizes#list"
      post '/bid', to: "prizes#bid"
      post '/prize_list', to: "prizes#prize_list"
      post '/won_prize_list', to: "prizes#won_prize_list"
    end
  end     

  resources :jobs do
    collection do
      get '/', to: "jobs#index"
    end
  end   

  resources :network do
    collection do
      get '/', to: "network#index"
      get '/restaurant/:id', to: "network#restaurant"
      get '/restaurant', to: "network#restaurant"
      post '/search', to: "network#search"
    end
  end   

  resources :analytics do
    collection do
      post 'day_data', to: "analytics#day_data"
      post 'week_data', to: "analytics#week_data"
    end
  end    

  resources :letsdishgo do
    collection do
      get '/', to: "letsdishgo#index"
      post 'create_user_and_restaurant', to: "letsdishgo#create_user_and_restaurant"
      post 'upload_menu_file', to: "letsdishgo#upload_menu_file"
      post 'destroy_file', to: "letsdishgo#destroy_file"
      post 'charge', to: "letsdishgo#charge"
      post 'user_check', to: "letsdishgo#user_check"
    end
  end  

  resources :odesk do
    collection do
      get '/', to: "odesk#index"
      get 'files/:id', to: "odesk#files"
      get 'edit_menu/:id', to: "odesk#edit_menu"
      get 'search_restaurants', to: "odesk#search_restaurants"
      post 'upload_image', to: "odesk#upload_image"
      post 'assign_to', to: "odesk#assign_to"
      post 'destroy_image', to: "odesk#destroy_image"
      post 'update_menu', to: "odesk#update_menu"
      post 'mark_menu_completed', to: "odesk#mark_menu_completed"
      post 'regenerate_token', to: "odesk#regenerate_token"
      post 'merge_menu'
    end
  end    

  resources :injected do
    collection do
      get '/:id', to: "injected#index"
    end
  end 

  resources :robots do
    collection do
      get '/sitemap.xml' => "robots#sitemap"
    end
  end   

  resources :onlinesite do
    collection do
      get 'index'
      get 'preview/:id', to: "onlinesite#preview"
      get 'live/:id', to: "onlinesite#index"
    end
  end  

  resources :profile do
    collection do
      get 'edit'
      get 'billing'
      get 'location'
      get 'set_password/:id', to: "profile#set_password"
      post 'set_password_form'
      post 'add_card'
      post 'subscribe'
      post 'reject_image'
      post 'smoke_notifications'
    end
  end

  resources :website do
    collection do
      get 'index'
      post 'submit_design'
      post 'upload_image'
      post 'upload_logo'
      post 'destroy_gallery_image'
      post 'upload_gallery'
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
      post 'destroy_sub_image'
      post 'upload_image'
      post 'create_image'
      post 'create_font'
      post 'destroy_font'
      post 'update_font'
    end
  end  

  resources :copymenu do
    collection do
      get 'index'
      post 'search'
      post 'initiate_copy'    
    end
  end

  resources :administration do
    collection do
      get 'restaurants'
      get 'edit_menu'      
      get 'users'    
      get 'become'    
      get 'users_csv'    
      get 'become_user'    
      get 'search_restaurants'
      post 'search_restaurants'
      get 'restaurant_setup'
      get 'search_users'
      post 'list_in_app'  
      post 'update_user'  
      post 'update_current_user'  
      post 'update_restaurant'  
      post 'free_search_restaurants'
      post 'destroy_user'  
      post 'publish_menu'
      post 'reset_draft_menu'
      post 'update_menu'
      post 'upload_image'        
      post 'create_user' 
      post 'user_set_restaurant'  
      post 'validate_subdomain'  
      post 'set_restaurant'  
      post 'create_restaurant'  
      post 'upload_icon'
      post 'create_user_for_restaurant'
      post 'crop_image'
      post 'crop_icon'       
      post 'helpme'       
      post 'load_user' 
      post 'load_profile_images'      
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
      post 'create_menu'
    end
  end 

  resources :menu_update do
    collection do
      post 'update_individual_option'
      post 'update_option'
      post 'update_dish'
      post 'update_section'
      post 'update_menu'
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
      match 'dish/set_rating', to: 'dish#set_rating', via: [:post] 
      match 'dish/get_ratings', to: 'dish#get_ratings', via: [:post] 
      match 'order/confirm', to: 'order#confirm', via: [:post] 
      match 'order/status', to: 'order#status', via: [:post]  
      match 'order/fetch_orders', to: 'order#fetch_orders', via: [:post]                
      match 'restaurant_admin/upload_image', to: 'restaurant_admin#upload_image', via: [:post]                
      match 'restaurant_admin/upload_image_file', to: 'restaurant_admin#upload_image_file', via: [:post]                
    end
  end
end
