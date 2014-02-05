ActiveAdmin.register Restaurant do 
  permit_params :id, image_attributes: [:rejected, :id]
  index do                            
    column :name                               
    default_actions                   
  end                                 

  filter :name   

  show do |resto|
    attributes_table do
      row :name
      row "Images" do
         ul do
          resto.image.each do |img|
            li do 
              image_tag("http://dev.foodcloud.ca:3000/assets/sources/" + img.local_file, :size => "128x128")
            end
          end
         end
      end
    end
  end

  form do |f|
    f.inputs "Details" do
      f.input :name
      f.has_many :image do |cf|
        loc = "http://dev.foodcloud.ca:3000/assets/sources/" + cf.object.local_file.to_s
        cf.input :rejected , :as => :boolean,  :label => cf.template.image_tag(loc, :size => "128x128")
      end  
    end
    f.actions
  end  

end                                   


