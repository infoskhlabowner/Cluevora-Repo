import desk from '../assets/images/mystery_desk_1787201439538.jpg';
import mansion from '../assets/images/mystery_mansion_1787201452393.jpg';
import vault from '../assets/images/mystery_vault_1787201466204.jpg';
import train from '../assets/images/mystery_train_1787201479464.jpg';

const images = [desk, mansion, vault, train];

export function getCaseImage(dayNumber: number) {
  if (typeof dayNumber !== 'number' || isNaN(dayNumber)) {
    return images[0];
  }
  return images[(dayNumber - 1) % images.length];
}
