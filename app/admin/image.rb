ActiveAdmin.register Image do
  permit_params :id, :restaurant_id, :rejected
  index do
    column :source
    default_actions
  end

  form do |f|
    f.inputs "Image Details" do
      f.input :source
    end
    f.actions
  end
end
