ActiveAdmin.register User do     
  index do                            
    column :email                     
    column :current_sign_in_at        
    column :last_sign_in_at           
    column :sign_in_count             
    default_actions                   
  end                                 

  filter :email

  show do |user|
    attributes_table do
      row :email
      row :encrypted_password
      row :facebook_auth_token
      row :facebook_user_id
      row :phone_number
      row "Addresses" do
         ul do
          user.addresses.each do |addy|
            li addy.street_address
            li addy.street_number
            li addy.default
          end
         end
      end
    end
  end

  form do |f|                         
    f.inputs "User Details" do       
      f.input :email                  
      f.input :password               
      f.input :password_confirmation  
    end                               
    f.actions                         
  end                                 
end                                   
